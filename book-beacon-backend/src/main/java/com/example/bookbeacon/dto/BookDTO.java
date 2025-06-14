package com.example.bookbeacon.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// Used for creating and updating books
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id; // Optional for creation, required for updates
    private String title;
    private String author;
    private String category;
    private String isbn;
    private Integer quantity;
    private Integer available;
    private Integer publishedYear;
    private String description;
	public String getIsbn() {
		// TODO Auto-generated method stub
		return null;
	}
}