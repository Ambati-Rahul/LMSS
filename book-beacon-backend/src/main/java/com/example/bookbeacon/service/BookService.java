package com.example.bookbeacon.service;

import com.example.bookbeacon.dto.BookDTO;
import com.example.bookbeacon.model.Book;
import com.example.bookbeacon.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BookDTO> getBookById(Long id) {
        return bookRepository.findById(id).map(this::convertToDto);
    }

    public Optional<BookDTO> getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn).map(this::convertToDto);
    }

    public BookDTO createBook(BookDTO bookDTO) {
        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN " + bookDTO.getIsbn() + " already exists.");
        }
        Book book = convertToEntity(bookDTO);
        book.setAvailable(book.getQuantity()); // Initially, all books are available
        return convertToDto(bookRepository.save(book));
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        return bookRepository.findById(id).map(existingBook -> {
            // Calculate new available quantity based on change in total quantity
            int quantityDifference = bookDTO.getQuantity()-existingBook.getQuantity();
            existingBook.setAvailable(existingBook.getAvailable() + quantityDifference);

            existingBook.setTitle(bookDTO.getTitle());
            existingBook.setAuthor(bookDTO.getAuthor());
            existingBook.setCategory(bookDTO.getCategory());
            existingBook.setIsbn(bookDTO.getIsbn()); // Should be careful with changing ISBN if it's a foreign key elsewhere
            existingBook.setQuantity(bookDTO.getQuantity());
            existingBook.setPublishedYear(bookDTO.getPublishedYear());
            existingBook.setDescription(bookDTO.getDescription());
            return convertToDto(bookRepository.save(existingBook));
        }).orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private BookDTO convertToDto(Book book) {
        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCategory(),
                book.getIsbn(),
                book.getQuantity(),
                book.getAvailable(),
                book.getPublishedYear(),
                book.getDescription()
        );
    }

    private Book convertToEntity(BookDTO bookDTO) {
        return new Book(
                bookDTO.getId(),
                bookDTO.getTitle(),
                bookDTO.getAuthor(),
                bookDTO.getCategory(),
                bookDTO.getIsbn(),
                bookDTO.getQuantity(),
                bookDTO.getAvailable(),
                bookDTO.getPublishedYear(),
                bookDTO.getDescription()
        );
    }
}