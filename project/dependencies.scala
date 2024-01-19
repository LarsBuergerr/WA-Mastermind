import sbt._
import Keys._
import sbt.librarymanagement.InclExclRule

object dependencies {
  val scala2Version = "2.13.10"
  val scala3Version = "3.2.2"

  val scalaTest = "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test
  val jackson = "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.11.4"
  val scalaTest3 = "org.scalatest" %% "scalatest" % "3.2.10" % "test"

  val commonDependency = Seq(
    scalaTest,
    jackson,
  )
}