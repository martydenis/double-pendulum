<?php require_once '../../_includes.php'; ?>
<!DOCTYPE html>
<html lang="<?php echo $language_iso; ?>">
  <head>
    <?php include_once '../../_games_head.php'; ?>
    <title>Double pendulum</title>
  </head>

  <body id="double-pendulum">
    <canvas id="canvas" width="400" height="400"></canvas>
    <canvas id="canvas-line" width="400" height="400"></canvas>

    <button>Reset Canvas</button>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
    <script src="<?php echo $js_path; ?>game.bundle.js"></script>
    <script src="./index.js"></script>
  </body>
</html>