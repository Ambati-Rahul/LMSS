package com.example.bookbeacon.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String category;

    @Column(unique = true)
    private String isbn;

    private Integer quantity;
    private Integer available;

    @Column(name = "published_year")
    private Integer publishedYear;

    private String description;
}