package com.example.bookbeacon.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequestDTO {
    private String membershipId;
    private String bookIsbn; // Renamed to bookIsbn for clarity
    private LocalDate dueDate;
}