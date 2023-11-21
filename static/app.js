
class BoggleGame{

    constructor(boardId, secs = 60) {
        this.secs = secs;
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId)

        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".submit-guess", this.board).on("submit", this.handleSubmit.bind(this))

    }

    addWord(guess) {
        $(".valid-words", this.board).append($("<ul>", { text: guess}))
    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showMessage(msg, cls) {
        $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`)
    }

    async handleSubmit(e) {
        e.preventDefault();
        const $guess = $(".guess", this.board);

        let guess = $guess.val();
        if (!guess) return;

        if (this.words.has(guess)) {
            this.showMessage(`${guess} has already been found!`, "err");
            return;
        }

        const resp = await axios.get("/check-guess", { params: { guess: guess } })
        if (resp.data.result === "not-word") {
            this.showMessage(`${guess} is not a valid word!`, "err")
        } else if (resp.data.result === "not-on-board") {
            this.showMessage(`${guess} is not on the board!`, "err")
        }
        else {
            this.showMessage(`Good choice!`, "ok")
            this.addWord(guess)
            this.score += guess.length;
            this.showScore();
            this.words.add(guess);
        }
        $guess.val("")
    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    async tick() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    async scoreGame() {
        $(".submit-guess", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`, "ok")
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok")
        }
    }
}





    




