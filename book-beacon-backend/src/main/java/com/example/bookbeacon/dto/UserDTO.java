package com.example.bookbeacon.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

// Used for creating and updating users
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String membershipId;
    private LocalDate joinDate;
    private String status;
    private Integer booksIssued;
}