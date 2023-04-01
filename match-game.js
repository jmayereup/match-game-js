class MatchGameMaker extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const text = this.textContent.trim().split('\n').map(line => line.trim()).join('\n');
        let wordbank = [];
        let shuffledPairs = [];
        let tiles = [];
        let shuffledTiles = [];
        let firstTile = null;

        // let game = generateMatchGame();

        wordbank = getWordBank(text);

        shuffledPairs = shuffleArray(wordbank);

        tiles = createTiles(shuffledPairs);

        shuffledTiles = shuffleTiles(tiles);




        function getWordBank(rawtext) {
            const splitText = rawtext.split('\n')
                .map(str => {
                    const [term, translation] = str.split(' - ');
                    return { term, translation }
                });
            return splitText;
        }

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function createTiles(shuffledPairs) {
            console.log("how many pairs", shuffledPairs);
            const tilesArray = [];
            let counter = 0;
            for (let pair of shuffledPairs) {
                if (counter >= 6) {
                    break;
                }
                let tile1 = document.createElement('div');
                tile1.classList.add("tile", "gametile");
                tile1.setAttribute('data-term', pair.term);
                tile1.setAttribute('data-translation', pair.translation);
                tile1.id = counter;
                tile1.addEventListener('click', handleTileClick);

                tilesArray.push(tile1);

                let tile2 = document.createElement('div');
                tile2.classList.add("tile", "gametile");
                tile2.setAttribute('data-term', pair.term);
                tile2.setAttribute('data-translation', pair.translation);
                tile2.id = (counter + 100);
                tile2.addEventListener('click', handleTileClick);

                tilesArray.push(tile2);

                counter++;
            }
            console.log("tiles create", tilesArray);
            return tilesArray;
        }

        function shuffleTiles(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function handleTileClick(event) {
            console.log("click passed", event);
            let clickedTile = event.target.closest(".gametile");
            console.log("clickedTile set to:", clickedTile);
            console.log(clickedTile.id);


            if (!clickedTile) {
                return;
            }
            clickedTile.classList.add("clicked");
            if (firstTile && firstTile.id === clickedTile.id) {
                firstTile.classList.remove("clicked");
                clickedTile.classList.remove("clicked");
                firstTile = null;
                clickedTile = null;
            }
            if (firstTile && clickedTile) {
                if (firstTile.dataset.english === clickedTile.dataset.english) {
                    firstTile.textContent = "\uD83D\uDE00";
                    clickedTile.textContent = "\uD83D\uDE00";
                    firstTile.classList.add("matched");
                    clickedTile.classList.add("matched");
                    console.log("match found");
                } else {
                    firstTile.classList.remove("clicked");
                    clickedTile.classList.remove("clicked");

                }
                firstTile = null;
                clickedTile = null;
            } else {
                firstTile = clickedTile;

            }
        }
        shadow.innerHTML = `
        <syle>
        .matchgamecontainer {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .tile {
            min-width: 30%;
            height: 80px;
            margin: 10px;
            padding: 5px;
            background-color: rgb(155, 235, 224);
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            font-size: large;
            font-weight: bold;
            transition: background-color 0.3s;
            flex-wrap: wrap;
        
        }
        
        .clicked {
            background-color: rgb(133, 115, 214);
        }
        
        .matched {
            background-color: #10a37f;
        }
        
        .tile:hover {
            background-color: gray;
        }
        
        .matchgamecontainer input[type="button"] {
            padding: 12px 0;
            color: #fff;
            background-color: #10a37f;
            border: none;
            border-radius: 4px;
            margin: 10px;
            text-align: center;
            cursor: pointer;
            width: 120px;
          }
        
        
        </style>
        `;

    }
}
customElements.define('match-game-maker', MatchGameMaker);