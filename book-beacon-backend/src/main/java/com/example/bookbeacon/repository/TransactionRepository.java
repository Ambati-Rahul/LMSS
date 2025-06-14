package com.example.bookbeacon.repository;

import com.example.bookbeacon.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByBookId(Long bookId);
    List<Transaction> findByStatus(String status);
    List<Transaction> findByUserIdAndStatus(Long userId, String status);
    List<Transaction> findByBookIdAndStatus(Long bookId, String status);
    // Find active (not returned) transactions for a specific book and user
    Optional<Transaction> findByMembershipIdAndBookIdAndStatus(String membershipId, String bookId, String status);
}