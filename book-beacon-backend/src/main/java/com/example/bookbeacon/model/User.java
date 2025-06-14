package com.example.bookbeacon.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String phone;
    private String role; // e.g., Student, Faculty, Staff

    @Column(name = "membership_id", unique = true)
    private String membershipId; // Unique identifier for library members

    @Column(name = "join_date")
    private LocalDate joinDate;

    private String status; // e.g., Active, Inactive, Suspended

    @Column(name = "books_issued")
    private Integer booksIssued;
}