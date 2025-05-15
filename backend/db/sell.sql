-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 15, 2025 at 04:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sell`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isAdmin` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `isAdmin`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$YRv9w265UENk5lh.7yxl/OmxHTjpP1H4RHVVF6yybBuHve9uqiPE', '2025-02-14 15:30:34', '2025-02-14 16:26:46', 'true'),
(2, 'suman', 'admin@example.com', '$2b$10$KEDz0C/iO7zVICYZK/h9U.0PWj1MHfFdd59C7sOYQgwuQDUxwdMua', '2025-02-14 15:53:19', '2025-02-14 16:31:40', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `quantity`, `userId`, `productId`) VALUES
(4, 5, 0, 0),
(6, 1, 0, 0),
(8, 1, 0, 0),
(9, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Carts`
--

CREATE TABLE `Carts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Carts`
--

INSERT INTO `Carts` (`id`, `userId`, `productId`, `quantity`, `createdAt`, `updatedAt`) VALUES
(1, 4, 12, 1, '2025-01-02 10:45:25', '2025-01-02 10:45:25'),
(3, 1, 16, 1, '2025-01-21 04:48:15', '2025-02-13 16:23:29'),
(4, 2, 12, 2, '2025-02-13 18:22:55', '2025-05-14 14:07:06'),
(5, 1, 12, 1, '2025-02-13 18:36:45', '2025-02-13 18:36:45'),
(6, 2, 16, 4, '2025-02-14 11:49:35', '2025-02-15 16:04:11');

-- --------------------------------------------------------

--
-- Table structure for table `new_orders`
--

CREATE TABLE `new_orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `new_orders`
--

INSERT INTO `new_orders` (`id`, `user_id`, `product_id`, `quantity`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 16, 1, 'card', 'pending', '2025-01-23 06:45:12', '2025-01-23 06:45:12');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `product_id`, `user_id`, `quantity`, `total_price`, `order_date`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(7, 12, 1, 1, NULL, '2025-02-13 18:36:50', 'card', 'failed', '2025-02-13 18:36:50', '2025-05-14 14:08:35'),
(8, 21, 1, 1, NULL, '2025-02-13 18:42:30', 'card', 'cancelled', '2025-02-13 18:42:30', '2025-05-14 14:06:01'),
(9, 12, 2, 1, NULL, '2025-02-13 18:43:28', 'card', 'cancelled', '2025-02-13 18:43:28', '2025-02-14 11:46:12'),
(10, 21, 2, 1, NULL, '2025-02-14 11:10:06', 'card', 'cancelled', '2025-02-14 11:10:06', '2025-02-15 16:01:22'),
(11, 16, 2, 1, NULL, '2025-02-14 11:47:32', 'card', 'cancelled', '2025-02-14 11:47:32', '2025-02-15 16:01:25'),
(12, 16, 2, 4, NULL, '2025-02-14 11:50:11', 'cod', 'cancelled', '2025-02-14 11:50:11', '2025-02-15 16:01:28'),
(13, 12, 1, 5, NULL, '2025-03-05 17:26:11', 'card', 'pending', '2025-03-05 17:26:11', '2025-03-05 17:26:11'),
(14, 16, 2, 1, NULL, '2025-05-14 14:07:24', 'upi', 'pending', '2025-05-14 14:07:24', '2025-05-14 14:07:24');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `priceUnit` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `name`, `image`, `price`, `priceUnit`, `description`, `rating`, `createdAt`, `updatedAt`, `category`) VALUES
(12, 'Fresh Apple', '/images/1734372804272.jpg', 400, 'kg', '', 0, '0000-00-00 00:00:00', '2025-02-13 16:19:37', 'Fruits'),
(16, 'Organic Weed', '/images/1747231973563.jpg', 100, 'per pouch', '', 0, '0000-00-00 00:00:00', '2025-05-14 14:12:53', 'herbs'),
(21, 'Green Tea', '/images/1734372816542.jpg', 250, 'kg', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Herbs');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `profileImage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `phone`, `pincode`, `createdAt`, `updatedAt`, `profileImage`) VALUES
(1, 'suman', 'suman@gmail.com', '$2b$10$Gh7h1mKvZbgLUEKf2vRoSO0UBJLeg6D1sB2IplXFS/Jm0AU8u/w1m', '9641025910', '767128', '2024-12-14 15:13:50', '2024-12-14 16:26:06', '/images/profiles/1735806327697.jpg'),
(2, 'Tewari', 'Tewari@758gmail.com', '$2b$10$R79pLnG9eoCEXwI439qjq./BvtQAUwQnTib7ON6pZrDvIrySOkcom', '1111111111', '11111', '2024-12-14 15:48:29', '2024-12-14 16:35:15', 'images/profiles/1733901495881.jpg'),
(3, 'sonam', 'email@gmail.com', '$2b$10$Gh7h1mKvZbgLUEKf2vRoSO0UBJLeg6D1sB2IplXFS/Jm0AU8u/w1m', '9999999999', '111111', '2024-12-14 16:27:10', '2024-12-16 12:03:36', NULL),
(4, 'testuser', 'testuser@gmail.com', '$2b$10$YVaf/iMMYo1DzTZ8mVQrr.oCLbdKKhE068p8AJRshLDUi8zVjDj6i', '1111111111', '737128', '2025-01-02 08:25:27', '2025-01-02 08:25:27', '/images/profiles/1735806327697.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Carts`
--
ALTER TABLE `Carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `new_orders`
--
ALTER TABLE `new_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_product` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Carts`
--
ALTER TABLE `Carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `new_orders`
--
ALTER TABLE `new_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Carts`
--
ALTER TABLE `Carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `new_orders`
--
ALTER TABLE `new_orders`
  ADD CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
