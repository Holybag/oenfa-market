package com.oenfa.oenfamarket.controller;

import java.util.List;

import com.oenfa.oenfamarket.dao.ProductRepository;
import com.oenfa.oenfamarket.model.Product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    private final ProductRepository repository;

    ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/product")
    public List<Product> index() {
        return repository.findAll();
    }
}