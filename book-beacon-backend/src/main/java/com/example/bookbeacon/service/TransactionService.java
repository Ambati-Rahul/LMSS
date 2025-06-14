package com.example.bookbeacon.service;

import com.example.bookbeacon.dto.TransactionDTO;
import com.example.bookbeacon.model.Book;
import com.example.bookbeacon.model.Transaction;
import com.example.bookbeacon.model.User;
import com.example.bookbeacon.repository.BookRepository;
import com.example.bookbeacon.repository.TransactionRepository;
import com.example.bookbeacon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TransactionDTO issueBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailable() <= 0) {
            throw new RuntimeException("Book is not available");
        }

        if (user.getBooksIssued() >= 3) {
            throw new RuntimeException("User has reached maximum book limit");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setIssueDate(LocalDate.now());
        transaction.setDueDate(LocalDate.now().plusDays(14)); // 2 weeks loan period
        transaction.setStatus("ISSUED");
        transaction.setFine(BigDecimal.ZERO);

        // Update book availability
        book.setAvailable(book.getAvailable() - 1);
        bookRepository.save(book);

        // Update user's issued books count
        user.setBooksIssued(user.getBooksIssued() + 1);
        userRepository.save(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    @Transactional
    public TransactionDTO returnBook(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if ("RETURNED".equals(transaction.getStatus())) {
            throw new RuntimeException("Book already returned");
        }

        Book book = transaction.getBook();
        User user = transaction.getUser();

        // Calculate fine if overdue
        BigDecimal fine = BigDecimal.ZERO;
        if (LocalDate.now().isAfter(transaction.getDueDate())) {
            long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(
                transaction.getDueDate(), LocalDate.now());
            fine = BigDecimal.valueOf(daysOverdue).multiply(BigDecimal.valueOf(1.0)); // $1 per day
        }

        transaction.setReturnDate(LocalDate.now());
        transaction.setStatus("RETURNED");
        transaction.setFine(fine);

        // Update book availability
        book.setAvailable(book.getAvailable() + 1);
        bookRepository.save(book);

        // Update user's issued books count
        user.setBooksIssued(user.getBooksIssued() - 1);
        userRepository.save(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    public List<TransactionDTO> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getBookTransactions(Long bookId) {
        return transactionRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUser().getId());
        dto.setBookId(transaction.getBook().getId());
        dto.setIssueDate(transaction.getIssueDate());
        dto.setDueDate(transaction.getDueDate());
        dto.setReturnDate(transaction.getReturnDate());
        dto.setStatus(transaction.getStatus());
        dto.setFine(transaction.getFine());
        
        // Set additional display fields
        dto.setUserName(transaction.getUser().getName());
        dto.setBookTitle(transaction.getBook().getTitle());
        dto.setBookIsbn(transaction.getBook().getIsbn());
        
        return dto;
    }
}