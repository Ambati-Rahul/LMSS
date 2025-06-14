package com.example.bookbeacon.repository;

import com.example.bookbeacon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMembershipId(String membershipId);
    boolean existsByMembershipId(String membershipId);
}