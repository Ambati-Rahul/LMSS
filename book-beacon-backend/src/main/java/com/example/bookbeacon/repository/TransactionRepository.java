package com.example.bookbeacon.repository;

import com.example.bookbeacon.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    // Custom query to find transaction by user's membership ID and book ID
    @Query("SELECT t FROM Transaction t WHERE t.user.membershipId = :membershipId AND t.book.id = :bookId AND t.status = :status")
    Optional<Transaction> findByUserMembershipIdAndBookIdAndStatus(
        @Param("membershipId") String membershipId, 
        @Param("bookId") Long bookId, 
        @Param("status") String status
    );
    
    // Custom query to find active transactions for a user by membership ID
    @Query("SELECT t FROM Transaction t WHERE t.user.membershipId = :membershipId AND t.status = :status")
    List<Transaction> findByUserMembershipIdAndStatus(
        @Param("membershipId") String membershipId, 
        @Param("status") String status
    );
}