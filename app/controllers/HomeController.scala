package controllers

import javax.inject._
import play.twirl.api.Html
import play.api._
import play.api.mvc._
import java.lang.ProcessBuilder.Redirect
import de.htwg.se.mastermind.controller.ControllerComponent.ControllerBaseImpl._
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.{Stone, HStone, HintStone}
import play.api.libs.json._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  var controller = new Controller()

  def main(title: String) = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.main(title) {
      Html("")
    })
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def createGame() = Action { implicit request: Request[AnyContent] =>
    controller = new Controller()
    Ok(views.html.displayGame(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def displayGame() = Action { implicit request: Request[AnyContent] =>
    Ok(controller.fileIO.gameToJson(controller.game))
  }

  def displayWinPage() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.displayWinPage(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def displayLosePage() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.displayLosePage(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def placeStone(stone: String, position: Int) = Action {implicit request: Request[AnyContent] =>
    controller.currentStoneVector = controller.currentStoneVector.updated(position, Stone(stone))
    Ok(views.html.displayGame(controller.gameToJson, controller.currentStoneVector, ""))  
  }

  /*
   * Implicit Writes for the Stone class
   */
  implicit val stoneWrites = new Writes[Stone] {
    def writes(stone: Stone) = Json.obj(
      "stone" -> stone.stringRepresentation
    )
  }

  implicit val vectorStoneWrites = new Writes[Vector[Stone]] {
    def writes(vectorStone: Vector[Stone]) = Json.obj(
      "stones" -> vectorStone.map(_.stringRepresentation)
    )
  }

  def placeStones(stones: String) = Action { implicit request: Request[AnyContent] =>
    val chars = stones.toCharArray()
    val stoneVector = controller.game.buildVector(Vector[Stone](), chars)
    val hints = controller.game.getCode().compareTo(stoneVector)

    // Enable to see the code
    // print(controller.game.getCode())
    //reset currentStoneVector to only empty stones
    controller.currentStoneVector = Vector.from[Stone](Array.fill[Stone](controller.game.field.matrix.cols)(Stone("E")))
    controller.placeGuessAndHints(stoneVector, hints, controller.game.getCurrentTurn())

    if(hints.forall(p => p.stringRepresentation.equals("R"))) {
      Ok(Json.obj("status" -> "win", "stones" -> controller.currentStoneVector.map(_.stringRepresentation)))
    } else if(controller.game.getRemainingTurns().equals(0)) {
      Ok(Json.obj("status" -> "lose", "stones" -> controller.currentStoneVector.map(_.stringRepresentation)))
    } else {
      Ok(controller.fileIO.gameToJson(controller.game))
    }
  }

  // About Page
  def about() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.about())
  }

  // Help Page
  def help() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.help())
  }

  // Pricing Page
  def pricing() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.pricing())}

  def login() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.login())
  }

  // Error Handling
  def notFound() = Action { implicit request: Request[AnyContent] => 
    NotFound(views.html.notFound())
  }
  
  def badRequest(errorMessage: String) = Action {
    BadRequest(errorMessage + "\n")
  }
}
