package com.project.demo.service;
import java.time.LocalDate;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.demo.model.Player;
import com.project.demo.repository.PlayerRepository;
import com.project.demo.model.PlayerFilterCriteria; // Import the missing class
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.Arrays;
import java.io.InputStreamReader;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;


@Service
public class PlayerServiceImpl implements PlayerService {
   
    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public Player createPlayer( Player player){
        if(playerRepository.existsByFirstNameAndLastNameAndDateOfBirth(player.getFirstName(), player.getLastName(), player.getDateOfBirth())) {
            return null; 
        } else {
            return playerRepository.save(player); 
        }
    }
    @Override
    public Player getPlayerById(Long id){
        return playerRepository.findById(id).orElse(null); 
    }
    
    @Override
    public List<Player> getAllPlayers(){
        try {
            return playerRepository.findAll(); 
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving players: " + e.getMessage()); 
        }   
    }
    @Override
    public void deletePlayer(Long id){
        Player player = getPlayerById(id); 
        playerRepository.delete(player); 
    }
    @Override
    public Player updatePlayer(Player player) {
        Player existingPlayer = getPlayerById(player.getId()); 
        existingPlayer.setFirstName(player.getFirstName());
        existingPlayer.setLastName(player.getLastName());
        existingPlayer.setNationalities(player.getNationalities());
        existingPlayer.setDateOfBirth(player.getDateOfBirth());
        existingPlayer.setPositions(player.getPositions());
        existingPlayer.setHeight(player.getHeight());
    
        return playerRepository.save(existingPlayer); 
    }

    
    @Override
    public List<Player> uploadPlayersFromCSV(MultipartFile file) {
        List<Player> players = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); 

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader() 
            .setSkipHeaderRecord(true) 
            .build();       
            try (CSVParser csvParser = new CSVParser(reader, csvFormat)) {

                for (CSVRecord csvRecord : csvParser) {
                    String firstName = csvRecord.get("firstName");
                    String lastName = csvRecord.get("lastName");
                    String dateOfBirth = csvRecord.get("dateOfBirth");
                    String nationalities = csvRecord.get("nationalities");
                    String positions = csvRecord.get("positions");
                    String height = csvRecord.get("height");
                    if (firstName == null || lastName == null || dateOfBirth == null) {
                        continue; 
                    }
                    Player player = new Player();
                    player.setFirstName(firstName);
                    player.setLastName(lastName);
                    try {
                        player.setDateOfBirth(LocalDate.parse(dateOfBirth, dateFormatter)); // Parse using custom formatter
                    } catch (Exception e) {
                        continue; 
                    }
                    if (nationalities != null && !nationalities.isEmpty()) {
                        String[] nationalitiesArray = nationalities.split(",");
                        player.setNationalities(Arrays.asList(nationalitiesArray));
                    }
                    if (positions != null && !positions.isEmpty()) {
                        String[] positionsArray = positions.split(",");
                        player.setPositions(Arrays.asList(positionsArray));
                    }
                    if (height != null && !height.isEmpty()) {
                        player.setHeight(Double.parseDouble(height));
                    }
                    if (!playerRepository.existsByFirstNameAndLastNameAndDateOfBirth(
                            player.getFirstName(), player.getLastName(), player.getDateOfBirth())) {
                        players.add(player);
                    }
                    player.setCreateAt(LocalDateTime.now()); 
                    player.setUpdatedAt(LocalDateTime.now());
                }
                csvParser.close();

            } catch (IOException e) {
                throw new RuntimeException("Failed to read CSV file: " + e.getMessage());
            }

            return playerRepository.saveAll(players);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
}

    @Override
    public Player savePlayer(@Valid Player player) {
        if(playerRepository.existsByFirstNameAndLastNameAndDateOfBirth(player.getFirstName(), player.getLastName(), player.getDateOfBirth())) {
            throw new IllegalArgumentException("Player already exists with the same name and date of birth.");
        }
        player.setUpdatedAt(LocalDateTime.now()); 
        return playerRepository.save(player);
    }

    @Override
    public List<Player> filterPlayers(PlayerFilterCriteria criteria) {
        List<Player> players = playerRepository.findAll(); // Get all players

        if (criteria.getFirstName() != null && !criteria.getFirstName().isEmpty()) {
            players = playerRepository.findByFirstNameContainingOrLastNameContaining(criteria.getFirstName(), criteria.getFirstName());
        }
        if (criteria.getLastName() != null && !criteria.getLastName().isEmpty()) {
            players = playerRepository.findByFirstNameContainingOrLastNameContaining(criteria.getLastName(), criteria.getLastName());
        }
        if (criteria.getNationalities() != null && !criteria.getNationalities().isEmpty()) {
            players = playerRepository.findByNationalitiesIn(criteria.getNationalities());
        }
        if (criteria.getPositions() != null && !criteria.getPositions().isEmpty()) {
            players = playerRepository.findByPositionsIn(criteria.getPositions());
        }
        if (criteria.getMinHeight() != null || criteria.getMaxHeight() != null) {
            Double minHeight = 150.0;
            Double maxHeight= 210.0;
            if(criteria.getMaxHeight() != null){
                maxHeight = criteria.getMaxHeight();
            }
            if(criteria.getMinHeight() != null){
                minHeight = criteria.getMinHeight();
            }
            players = playerRepository.findByHeightBetween(minHeight , maxHeight);
        }
        if (criteria.getMinAge() != null || criteria.getMaxAge() != null) {

            LocalDate now= LocalDate.now();
            LocalDate maxBirthDate = criteria.getMinAge() != null ? now.minusYears(criteria.getMinAge()): LocalDate.MAX ;
            LocalDate minBirthDate = criteria.getMaxAge() != null ? now.minusYears(criteria.getMaxAge() + 1).plusDays(1): LocalDate.MIN;

            players = playerRepository.findByDateOfBirthBetween(minBirthDate,maxBirthDate);
        }
        
        
        
        return players; 
    }

}
