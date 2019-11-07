import Glide from "@glidejs/glide/dist/glide";

function renderSliderSection(segmentedText) {
	const segmentEl = document.createElement('div');

	segmentEl.className = `glide`;
	segmentEl.innerHTML =
		`<div class="glide__arrows" data-glide-el="controls">
			<button class="glide__arrow glide__arrow--prev" data-glide-dir="<"><</button>
			<span class="arrow_index">(1 / ${segmentedText.length})</span>
			<button class="glide__arrow glide__arrow--next" data-glide-dir=">">></button>
    	</div>
		<div class="glide__track" data-glide-el="track">
			<ul class="glide__slides"></ul>
		</div>`
	;

	const listEl = segmentEl.querySelector(`ul`);
	for(let i in segmentedText) {
		const liEl = document.createElement('li');
		const frameEl = document.createElement(`iframe`);
		frameEl.src = `${location.toString()}`;
		frameEl.addEventListener(`load`, function(e) {
			e.target.contentWindow.postMessage({
				action: `setOriginalText`,
				options: { text: segmentedText[i] }
			}, `*`);
		});

		liEl.className = `glide__slide`;
		liEl.appendChild(frameEl);
		listEl.appendChild(liEl);
	}
	const buttonEventEl = segmentEl.querySelector('.arrow_index');
	return { segmentEl, buttonEventEl };
}
function glideSetup() {
	const glide = new Glide('.glide', {
		//swipeThreshold: 80
		type: 'carousel',
		autoplay: 0,
		animationDuration: 300,
		animationTimingFunc: 'linear',
		perView: 1,
		keyboard: false
	}).mount();

	return glide;
}

export function constructSegmentController(controller, segmentedText) {
	const { segmentEl, buttonEventEl } = renderSliderSection(segmentedText);

	controller.segmentedTextEl.insertBefore(segmentEl, controller.segmentedTextEl.firstElementChild.nextSibling);
	const glide = glideSetup();
	glide.on(['mount.after', 'run'], function () {
		buttonEventEl.innerHTML = `( ${glide.index+1} / ${segmentedText.length} )`;
	})

	return { segmentEl };
}