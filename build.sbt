ThisBuild / scalaVersion := "2.13.10"
ThisBuild / version := "1.0"
scalacOptions += "-Ytasty-reader"
exportJars := true

lazy val root = (project in file("."))
    .enablePlugins(PlayScala, SbtWeb, SbtLess)
    .settings(
        name:= """WA-Mastermind""",
        includeFilter in (Assets, LessKeys.less) := "index.less",
        libraryDependencies ++= Seq(
            guice,
            "org.scalatestplus.play" %% "scalatestplus-play" % "6.0.0-RC2" % Test,
                    )
    )