package com.oenfa.oenfamarket.dao;

import com.oenfa.oenfamarket.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}