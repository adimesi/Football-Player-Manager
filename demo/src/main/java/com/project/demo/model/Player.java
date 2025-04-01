package com.project.demo.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
// import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.NotEmpty;
import jakarta.persistence.Id;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;




@Entity
// @Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    
    @ElementCollection

    private List<String> nationalities = new ArrayList<>();
    
    @Past(message = "Date of birth must be in the past")
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @ElementCollection
    private List<String> positions = new ArrayList<>();

    private double height;
    
    @CreationTimestamp
    private LocalDateTime createAt;
    
    @CreationTimestamp
    private LocalDateTime updatedAt;

    public Player() {
    }   

    // getters and setters
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    public List<String> getPositions() {
        return positions;
    }
    public void setPositions(List<String> positions) {
        this.positions = positions;
    }
    public double getHeight() {
        return height;
    }
    public void setHeight(double height) {
        this.height = height;
    }
    public LocalDateTime getCreateAt() {
        return createAt;
    }
    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public List<String> getNationalities() {
        return nationalities;
    }
    public void setNationalities(List<String> nationalities) {
        this.nationalities = nationalities;
    }


    
    
    
    



}
