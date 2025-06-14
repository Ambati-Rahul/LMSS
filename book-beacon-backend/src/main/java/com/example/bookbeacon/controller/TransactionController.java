package com.example.bookbeacon.controller;

import com.example.bookbeacon.dto.TransactionDTO;
import com.example.bookbeacon.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:8080")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(
            @RequestParam Long userId,
            @RequestParam Long bookId) {
        try {
            TransactionDTO transaction = transactionService.issueBook(userId, bookId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/return/{transactionId}")
    public ResponseEntity<?> returnBook(@PathVariable Long transactionId) {
        try {
            TransactionDTO transaction = transactionService.returnBook(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getUserTransactions(@PathVariable Long userId) {
        List<TransactionDTO> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<TransactionDTO>> getBookTransactions(@PathVariable Long bookId) {
        List<TransactionDTO> transactions = transactionService.getBookTransactions(bookId);
        return ResponseEntity.ok(transactions);
    }
}