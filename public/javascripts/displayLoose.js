function renderLooseGameField(gameData) {
  // Clear the current game field
  $('.game-box').empty();
  $('.hintstone-box').empty();

  // Create the specified number of rows
  gameData.matrix.forEach(function(row, index) {
    var $row = $('<div>').addClass('game-row');
    var $hintstoneRow = $('<div>').addClass('hintstone-row');

    // Create the specified number of cells in each row
    row.cells.forEach(function() {
      var $cell = $('<img>').addClass('stone-cell-locked');
      $cell.attr('src', '/assets/images/stones/stone_R.png');
      $row.append($cell);
    });

    // Create the specified number of hintstones in each row
    gameData.hmatrix[index].cells.forEach(function() {
      var $hintstone = $('<img>').addClass('hintstone-cell');
      $hintstone.attr('src', '/assets/images/hintstones/hstone_E.png');
      $hintstoneRow.append($hintstone);
    });

    // Add the row to the game box
    $('.game-box').append($row);
    $('.hintstone-box').append($hintstoneRow);
  });
}