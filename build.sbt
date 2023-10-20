ThisBuild / scalaVersion := "2.13.10"
ThisBuild / version := "1.0"
scalacOptions += "-Ytasty-reader"
exportJars := true

lazy val root = (project in file("."))
    .enablePlugins(PlayScala)
    .settings(
        name:= """WA-Mastermind""",
        libraryDependencies ++= Seq(
            guice,
            "org.scalatestplus.play" %% "scalatestplus-play" % "6.0.0-RC2" % Test
                    )
    )