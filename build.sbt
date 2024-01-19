import dependencies._

name := """mastermindWeb"""

lazy val root = project
    .in(file("."))
    .settings(
        scalaVersion := scala2Version,
        scalacOptions += "-Ytasty-reader",
        name := "mastermindWeb",
        libraryDependencies ++= Seq(
            guice,
            ws
            ),
        libraryDependencies ++= commonDependency,
    )
    .enablePlugins(PlayScala, SbtWeb)