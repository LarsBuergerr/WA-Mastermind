package controllers

import javax.inject._
import play.twirl.api.Html
import java.lang.ProcessBuilder.Redirect
import de.htwg.se.mastermind.controller.ControllerComponent.ControllerBaseImpl._
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.Game
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.Field
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.{Stone, HStone, HintStone}
import play.api.libs.json._
import play.api.mvc._
import akka.actor._
import akka.stream.Materializer
import play.api.libs.streams.ActorFlow
import javax.inject._
import collection.mutable.ListBuffer
import de.htwg.se.mastermind.model.GameComponent.GameBaseImpl.Code
import de.htwg.se.mastermind.model.FileIOComponent.fileIOjsonImpl.FileIO

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends BaseController {

  var status = "continue"
  var current_turn = "player1"

  var code = new Code(4)
  var game = Game(new Field(10, 4, Stone("E"), HintStone("E")), code, 0)
  var controller = Controller(game, new FileIO)
  
  var controller_map: Map[String, Controller] = Map[String, Controller]()
  var hash_map: Map[String, String] = Map[String, String]()
  var client_map: Map[String, ListBuffer[ActorRef]] = Map[String, ListBuffer[ActorRef]]()

  def main(title: String) = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.main(title) {
      Html("")
    })
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    print("created singleplayer with code: ")
    println(controller.game.getCode())
    Ok(views.html.index(controller.gameToJson, controller.currentStoneVector, ""))
  }

  def createGame() = Action { implicit request: Request[AnyContent] =>
    print("created new game with code: ")
    controller = new Controller()
    println(controller.game.getCode())
    Ok(Json.obj("status" -> "continue", "game" -> controller.fileIO.gameToJson(controller.game)))
  }

  def displayGame() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.obj("status" -> "continue", "game" -> controller.fileIO.gameToJson(controller.game)))
  }

  /* ------------------- Multiplayer ------------------- */

  def joinMultiplayer() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.joinMultiplayer())
  }

  def createMultiplayer() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.createMultiplayer())
  }

  def multiplayer(hash: String, player: String) = Action { implicit request: Request[AnyContent] =>
    var multi_controller = new Controller()
    controller_map += (hash -> multi_controller)
    hash_map += (hash -> player)
    print("created multiplayer with code: ")
    println(controller_map(hash).game.getCode())
    Ok(Json.obj("status" -> "continue", "game" -> controller.fileIO.gameToJson(controller.game)))
  }

  def join(hash: String, player: String) = Action { implicit request: Request[AnyContent] =>
      Ok(views.html.multiplayer())
  }

  def getGameMultiplayer(hash: String) = Action { implicit request: Request[AnyContent] =>
    print("get Game Multiplayer")
    Ok("success")
  }

  def placeStonesMultiplayer(hash: String, stones: String) = Action { implicit request: Request[AnyContent] =>
    // switch turn to other player
    if (current_turn.equals("player1")) {
      current_turn = "player2"
    } else {
      current_turn = "player1"
    }

    val chars = stones.toCharArray()
    val stoneVector = controller_map(hash).game.buildVector(Vector[Stone](), chars)
    val hints = controller_map(hash).game.getCode().compareTo(stoneVector)

    controller_map(hash).currentStoneVector = Vector.from[Stone](Array.fill[Stone](controller_map(hash).game.field.matrix.cols)(Stone("E")))
    controller_map(hash).placeGuessAndHints(stoneVector, hints, controller_map(hash).game.getCurrentTurn())
    
    if (hints.forall(p => p.stringRepresentation.equals("R"))) { // Win
      status = "win"
    } else if (controller_map(hash).game.getRemainingTurns().equals(0)) { // Lose
      status = "lose"
    }

    Ok("success")
  }


 /* --------------------------------------------------- */

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
    print("PLACE STONESSSSSSSSS")
    val chars = stones.toCharArray()
    val stoneVector = controller.game.buildVector(Vector[Stone](), chars)
    val hints = controller.game.getCode().compareTo(stoneVector)

    controller.currentStoneVector = Vector.from[Stone](Array.fill[Stone](controller.game.field.matrix.cols)(Stone("E")))
    controller.placeGuessAndHints(stoneVector, hints, controller.game.getCurrentTurn())

    if(hints.forall(p => p.stringRepresentation.equals("R"))) { // Win
      Ok(Json.obj("status" -> "win", "game" -> controller.fileIO.gameToJson(controller.game)))
    } else if(controller.game.getRemainingTurns().equals(0)) {  // Lose
      Ok(Json.obj("status" -> "lose", "game" -> controller.fileIO.gameToJson(controller.game)))
    } else {  // Continue
      Ok(Json.obj("status" -> "continue", "game" -> controller.fileIO.gameToJson(controller.game)))
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


  // Error Handling
  def notFound() = Action { implicit request: Request[AnyContent] => 
    NotFound(views.html.notFound())
  }
  
  def badRequest(errorMessage: String) = Action {
    BadRequest(errorMessage + "\n")
  }

  def socket(hash:String): WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connection received")
      MastermindSocketActorFactory.create(out,hash)
    }
  }

  class MastermindSocketActor(out: ActorRef, hash:String) extends Actor {
    if (client_map.contains(hash)) {
      if (client_map(hash).length < 2) {
        var a = client_map(hash)
        a += out
        println(a.length)
        client_map += (hash -> a)
      }
    } else {
      client_map += (hash -> ListBuffer(out))
    }
    def receive: Receive = {
      case "Keep alive" => out ! "Keep alive"
      case "refresh" => {
        for (client <- client_map(hash)) {
          println("refreshed")
          println(client_map(hash).length)
          client ! Json.obj("current_turn" -> current_turn, "status" -> status, "game" -> controller_map(hash).gameToJson).toString()
        }
      }
      case msg: JsObject =>
        println("ws: " + msg + " for game: " + hash)
        out ! Json.obj("current_turn" -> current_turn, "status" -> status, "game" -> controller_map(hash).gameToJson).toString()
    }
  }

  object MastermindSocketActorFactory {
    def create(out: ActorRef, hash: String): Props = {
      Props(new MastermindSocketActor(out, hash))
    }
  }
}
