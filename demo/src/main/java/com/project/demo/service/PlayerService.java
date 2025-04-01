package com.project.demo.service;
import java.util.List;
import com.project.demo.model.PlayerFilterCriteria;
import com.project.demo.model.Player;

// import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;


public interface PlayerService {
    
    public Player savePlayer(Player player);
    public Player createPlayer(Player player);
    public Player updatePlayer(Player player);
    public Player getPlayerById(Long id);
    public void deletePlayer(Long id);
    public List<Player> getAllPlayers();
    public List<Player> filterPlayers(PlayerFilterCriteria criteria);
    public List<Player> uploadPlayersFromCSV(MultipartFile file);



}
