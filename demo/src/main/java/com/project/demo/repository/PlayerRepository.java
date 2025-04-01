package com.project.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.demo.model.Player;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlayerRepository  extends JpaRepository<Player, Long> {
    
    boolean existsByFirstNameAndLastNameAndDateOfBirth(String firstName, String lastName, LocalDate dateOfBirth);
    List<Player> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    List<Player> findByNationalitiesIn(List<String> nationalities);
    List<Player> findByPositionsIn(List<String> positions);
    List<Player> findByDateOfBirthBetween(LocalDate startDate, LocalDate endDate);
    List<Player> findByHeightBetween(Double minHeight, Double maxHeight);

}
