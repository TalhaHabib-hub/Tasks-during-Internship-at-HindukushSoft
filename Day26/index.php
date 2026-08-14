
<?php
$contactsFile ='contact.json';
$contacts = file_exists($contactsFile) ? json_decode(file_get_contents($contactsFile), true) : [];
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
  <a href="create.php" id='create'>Create new contact</a>
 
  <ul>
    <?php foreach ($contacts as $contact): ?>
      <li>
        <span>
        <img src="<?php echo $contact['image']; ?>" height="50">
        <?php echo "<P class='data'><big>{$contact['name']}</big> <br> {$contact['email']} <br> {$contact['phone']}</p>"; ?>
      </span>
        <a class="button" href="delete.php?id=<?php echo $contact['id']; ?>">
          Delete
        </a>
      </li>
    <?php endforeach; ?>
  </ul>
</body>
 
</html>