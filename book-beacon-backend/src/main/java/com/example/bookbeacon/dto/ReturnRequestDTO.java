package com.example.bookbeacon.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequestDTO {
    private String membershipId;
    private String bookIsbn;
}