<?php
// var_dump($_SERVER);
// var_dump($_POST);
// var_dump($_GET);

// echo '<pre>';
// var_dump($_FILES);
// echo '</pre>';

$uploadsDir =  'uploads/';
$contactsFile = 'contact.json';




if ($_SERVER['REQUEST_METHOD'] == "POST") {
  $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
  $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
  $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);

  if ($name && $email && $phone && isset($_FILES['image'])) {

    if (!is_dir($uploadsDir)) {
      mkdir($uploadsDir, 0777, true);
    }
    $imageName = time() . "_" . basename($_FILES["image"]["name"]);
    $imagePath = $uploadsDir . $imageName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
      $contacts = file_exists($contactsFile) ?
        json_decode(file_get_contents($contactsFile),true) : [];

      $contacts[] = [
        'id' => rand(10000000, 20000000),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'image' => $imagePath
      ];

      file_put_contents(
        $contactsFile,
        json_encode($contacts, JSON_PRETTY_PRINT)
      );
      echo "<P class='contact-added'>Contact added: $name ($email, $phone)</p>";
    } else {
      echo "<P class='upload-fail'>Image upload failed</p>";
    }
  } else {
    echo "<P class='invalid'>Invalid input/all inputs are necessary!</p>";
  };
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="index.css">
  <title>Document</title>
</head>

<body>
  <!-- <center> -->
  <form action="create.php" method="post" enctype="multipart/form-data">

    <label for="name">name</label><br>
    <input type="text" name="name" id="name" placeholder="Jhon"><br>
    <label for="name">email</label><br>
    <input type="email" name="email" id="email" placeholder="jhon@gmail.com"><br>
    <label for="phone">phone</label><br>
    <input type="phone" name="phone" id="phone" placeholder="+92-1234567890"><br>
    <input type="file" name="image" class="file-label">

    <button type="submit" class="but">Add</button>
  </form>
  <!-- </center> -->
</body>

</html>