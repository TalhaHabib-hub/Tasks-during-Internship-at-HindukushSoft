<?php

// var_dump($_SERVER);
// var_dump($_POST);
// var_dump($_GET);
echo '<pre>';
var_dump($_FILES);
echo '</pre>';


if ($_SERVER['REQUEST_METHOD'] == "POST") {
  $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
  $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
  $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
  var_dump($name, $email, $phone);
  if ($name && $email && $phone) {
    echo "Contact added: $name ($email, $phone)";
  } else {
    echo "Invalid input";
  };
}