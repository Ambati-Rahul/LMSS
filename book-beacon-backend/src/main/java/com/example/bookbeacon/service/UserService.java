package com.example.bookbeacon.service;

import com.example.bookbeacon.dto.UserDTO;
import com.example.bookbeacon.model.User;
import com.example.bookbeacon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToDto);
    }

    public Optional<UserDTO> getUserByMembershipId(String membershipId) {
        return userRepository.findByMembershipId(membershipId).map(this::convertToDto);
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByMembershipId(userDTO.getMembershipId())) {
            throw new IllegalArgumentException("User with membership ID " + userDTO.getMembershipId() + " already exists.");
        }
        User user = convertToEntity(userDTO);
        if (user.getJoinDate() == null) {
            user.setJoinDate(LocalDate.now());
        }
        if (user.getStatus() == null || user.getStatus().isEmpty()) {
            user.setStatus("Active");
        }
        if (user.getBooksIssued() == null) {
            user.setBooksIssued(0);
        }
        return convertToDto(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        existingUser.setName(userDTO.getName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPhone(userDTO.getPhone());
        existingUser.setRole(userDTO.getRole());
        existingUser.setMembershipId(userDTO.getMembershipId());
        existingUser.setJoinDate(userDTO.getJoinDate());
        existingUser.setStatus(userDTO.getStatus());
        existingUser.setBooksIssued(userDTO.getBooksIssued());

        return convertToDto(userRepository.save(existingUser));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setMembershipId(user.getMembershipId());
        dto.setJoinDate(user.getJoinDate());
        dto.setStatus(user.getStatus());
        dto.setBooksIssued(user.getBooksIssued());
        return dto;
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole());
        user.setMembershipId(userDTO.getMembershipId());
        user.setJoinDate(userDTO.getJoinDate());
        user.setStatus(userDTO.getStatus());
        user.setBooksIssued(userDTO.getBooksIssued());
        return user;
    }
}