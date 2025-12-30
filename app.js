/* global SONGS */

const grid = document.getElementById("songGrid");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");

/** @type {{ audio: HTMLAudioElement, card: HTMLElement, title: string } | null} */
let active = null;

function setActive(next) {
	if (active && active.audio !== next.audio) {
		active.audio.pause();
		// Requirement: when switching to another song, replaying the previous
		// should start from the beginning (not resume).
		try {
			active.audio.currentTime = 0;
		} catch {
			// ignore
		}
		active.card.classList.remove("is-active");
	}
	active = next;
	active.card.classList.add("is-active");
	nowPlayingTitle.textContent = next.title;
}

function safeUrl(path) {
	// Ensure spaces and other characters are encoded
	return encodeURI(path);
}

function createSongCard(song, index) {
	const card = document.createElement("article");
	card.className = "card";
	card.setAttribute("data-index", String(index));

	const coverWrap = document.createElement("div");
	coverWrap.className = "coverWrap";

	const img = document.createElement("img");
	img.className = "cover";
	img.alt = `${song.title} cover`;
	img.loading = "lazy";
	img.src = safeUrl(song.coverSrc);
	coverWrap.appendChild(img);

	const titleRow = document.createElement("div");
	titleRow.className = "titleRow";

	const title = document.createElement("div");
	title.className = "title";
	title.textContent = song.title;

	const badge = document.createElement("div");
	badge.className = "badge";
	badge.textContent = `#${String(index + 1).padStart(2, "0")}`;

	titleRow.appendChild(title);
	titleRow.appendChild(badge);

	const controls = document.createElement("div");
	controls.className = "controls";

	const audio = document.createElement("audio");
	audio.preload = "metadata";
	audio.src = safeUrl(song.audioSrc);
	audio.muted = false; // default unmuted
	audio.playsInline = true;
	audio.controls = true;
	audio.className = "nativeAudio";

	audio.addEventListener("play", () => {
		setActive({ audio, card, title: song.title });
		// Ensure the active one is not muted by default
		if (audio.muted) audio.muted = false;
	});

	controls.appendChild(audio);

	card.appendChild(coverWrap);
	card.appendChild(titleRow);
	card.appendChild(controls);

	return card;
}

function init() {
	if (!Array.isArray(SONGS) || SONGS.length !== 12) {
		console.warn("Expected SONGS to contain exactly 12 items.");
	}

	grid.innerHTML = "";
	SONGS.slice(0, 12).forEach((song, i) => {
		grid.appendChild(createSongCard(song, i));
	});
}

init();
