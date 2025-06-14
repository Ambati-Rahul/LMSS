package com.example.bookbeacon.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "books")
@Data // Lombok: Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok: Generates no-argument constructor
@AllArgsConstructor // Lombok: Generates constructor with all fields
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use Long for primary keys

    private String title;
    private String author;
    private String category;

    @Column(unique = true) // ISBN should be unique
    private String isbn;

    private Integer quantity;
    private Integer available;

    @Column(name = "published_year")
    private Integer publishedYear;

    private String description;

	public Object getQuantity() {
		// TODO Auto-generated method stub
		return null;
	}
}