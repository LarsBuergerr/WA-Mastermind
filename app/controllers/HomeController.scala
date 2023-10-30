package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import java.lang.ProcessBuilder.Redirect
import de.htwg.se.mastermind.controller.ControllerComponent.ControllerBaseImpl._
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.{Stone, HStone, HintStone}
/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  var controller = new Controller()

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def displayGame() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.displayGame(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def placeStone(stone: String, position: Int) = Action {implicit request: Request[AnyContent] =>
    controller.currentStoneVector = controller.currentStoneVector.updated(position, Stone(stone))
    Ok(views.html.displayGame(controller.gameToJson, controller.currentStoneVector, ""))  
  }

  def placeStones(stones: String) = Action { implicit request: Request[AnyContent] =>
    val chars = stones.toCharArray()
    val stoneVector = controller.game.buildVector(Vector[Stone](), chars)
    val hints = controller.game.getCode().compareTo(stoneVector)

    //reset currentStoneVector to only empty stones
    controller.currentStoneVector = Vector.from[Stone](Array.fill[Stone](controller.game.field.matrix.cols)(Stone("E")))
    controller.placeGuessAndHints(stoneVector, hints, controller.game.getCurrentTurn())
    Ok(views.html.displayGame(controller.gameToJson, controller.currentStoneVector, ""))
  }

  // About Page
  def about() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.about())
  }

  // Help Page
  def help() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.help())
  }

  // Error Handling
  def notFound() = Action { implicit request: Request[AnyContent] => 
    NotFound(views.html.notFound())
  }
  
  def badRequest(errorMessage: String) = Action {
    BadRequest(errorMessage + "\n")
  }
}
