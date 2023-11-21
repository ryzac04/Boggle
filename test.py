from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config["TESTING"] = True

    def test_homepage(self):
        with self.client:
            response = self.client.get("/")
            self.assertIn("board", session)
            self.assertIn(b"Score:", response.data)
            self.assertIn(b"Time Left:", session)
            self.assertIn(b"<p>High Score:", session)
            self.assertIsNone(session.get("highscore"))
            self.assertIsNone(session.get("nplays"))

    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as session:
                session["board"] = [
                    ["C", "A", "T", "T", "T"],
                    ["C", "A", "T", "T", "T"],
                    ["C", "A", "T", "T", "T"],
                    ["C", "A", "T", "T", "T"],
                    ["C", "A", "T", "T", "T"],
                ]
        response = self.client.get("/check-guess?guess=cat")
        self.assertEqual(response.json["result"], "ok")

    def test_invalid_word(self):
        self.client.get("/")
        response = self.client.get("/check-guess?guess=impossible")
        self.assertEqual(response.json["result"], "non-on-board")

    def non_english_word(self):
        self.client.get("/")
        response = self.client.get("/check-guess?guess=eosdlfkjoweicxlkdjwsoesdoi")
        self.assertEqual(response.json["result"], "not-word")
