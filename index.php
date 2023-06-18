<?php require_once '../../_includes.php'; ?>
<!DOCTYPE html>
<html lang="<?php echo $language_iso; ?>">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="icon" type="image/svg" href="<?php echo $favicon_path; ?>favicon.svg" />
    <link rel="stylesheet" type="text/css" href="<?php echo $css_path; ?>game.css" media="screen" />
    <link rel="stylesheet" type="text/css" href="./index.css" media="screen" />
    <title>Double pendulum</title>
  </head>

  <body id="double-pendulum">
    <a href="<?php echo $sandbox_path; ?>" id="back">Back</a>

    <canvas id="canvas" width="400" height="400"></canvas>
    <canvas id="canvas-line" width="400" height="400"></canvas>

    <button>Reset Canvas</button>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
    <script src="<?php echo $js_path; ?>game.bundle.js"></script>
    <script src="./index.js"></script>
  </body>
</html>