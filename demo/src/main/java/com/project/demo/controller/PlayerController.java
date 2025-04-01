package com.project.demo.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.project.demo.model.Player;
import com.project.demo.model.PlayerFilterCriteria;
import com.project.demo.service.PlayerService;
import java.util.List;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.CrossOrigin;





@RestController
@RequestMapping("/api/player")
@CrossOrigin(origins = "http://localhost:3000") 
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PostMapping
    public ResponseEntity<Player> createPlayer( @Valid @RequestBody Player player) {
        try {
            Player existingPlayer = playerService.createPlayer(player);
            if (existingPlayer == null) {
                return new ResponseEntity<>(HttpStatus.CONFLICT); 
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
        }
        return new ResponseEntity<>(player, HttpStatus.CREATED); 
    }
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        return new ResponseEntity<>(player, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@Valid @PathVariable Long id,@RequestBody Player player) {
        
        Player existingPlayer = playerService.getPlayerById(id);
        try {
            if (existingPlayer == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        player.setId(id); 
        Player updatedPlayer = playerService.updatePlayer(player);
        updatedPlayer.setUpdatedAt(LocalDateTime.now()); 
        return new ResponseEntity<>(updatedPlayer, HttpStatus.OK); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        if (player == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        playerService.deletePlayer(id); 
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<List<Player>> bulkUpload(@RequestParam("file") MultipartFile file) {
        List<Player> players = playerService.uploadPlayersFromCSV(file); 
        return ResponseEntity.status(HttpStatus.CREATED).body(players); 

    }

    @PostMapping("/filter")
    public ResponseEntity<List<Player>> filterPlayers( @RequestBody PlayerFilterCriteria criteria) {
        if (criteria == null) {
            return ResponseEntity.badRequest().body(null); 
        }
        return ResponseEntity.ok(playerService.filterPlayers(criteria));
    }


}
