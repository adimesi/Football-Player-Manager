package com.project.demo.model;

import java.util.List;

public class PlayerFilterCriteria {
    private String FirstName;
    private String lastName;
    private List<String> nationalities;
    private Integer minAge;
    private Integer maxAge;
    private List<String> positions;
    private Double minHeight;
    private Double maxHeight;


    public String getFirstName() {
        return FirstName;
    }
    public void setFirstName(String FirstName) {
        this.FirstName = FirstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public List<String> getNationalities() {
        return nationalities;
    }
    public void setNationalities(List<String> nationalities) {
        this.nationalities = nationalities;
    }
    public Integer getMinAge() {
        return minAge;
    }
    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }
    public Integer getMaxAge() {
        return maxAge;
    }
    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }
    public List<String> getPositions() {
        return positions;
    }
    public void setPositions(List<String> positions) {
        this.positions = positions;
    }
    public Double getMinHeight() {
        return minHeight;
    }
    public void setMinHeight(Double minHeight) {
        this.minHeight = minHeight;
    }
    public Double getMaxHeight() {
        return maxHeight;
    }
    public void setMaxHeight(Double maxHeight) {
        this.maxHeight = maxHeight;

    }
}
