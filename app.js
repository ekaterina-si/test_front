window.onload = () => {
	class Counter {
		constructor(input) {
			this.count = input.value;
			this.input = input;
		}
		get value() {
			return this.count
		}
		set value(val) {
			this.count = val;
			this._setInputValue()
		}
		increase() {
			this.count++;
			this._setInputValue()
		}
		decrease() {
			if (this.count > 0) {
				this.count--;
				this._setInputValue()
			}
		}
		_setInputValue() {
			this.input.value = this.count;
			if (this.input.closest('.product-card').id) {
				sessionStorage.setItem(this.input.closest('.product-card').id, this.count);
			}
		}
	}

	const catalog = document.querySelector('.catalog');
	const cards = catalog.querySelectorAll('.product-card');

	cards.forEach(card => {
		if (sessionStorage.getItem(card.id)) {
			card.querySelector('.counter__input').value = sessionStorage.getItem(card.id)
		}
		const counter = addCounter(card);
		const btn = card.querySelector('.product-card__add-to-cart');
		btn.addEventListener('click', () => {
			fetch('/')
				.then(res => res.text())
				.then(text => {
					const parser = new DOMParser();
					const doc = parser.parseFromString(text, 'text/html');

					const receivedCards = doc.querySelectorAll('.product-card');
					receivedCards.forEach(elem => {
						if (card.id === elem.id) {
							showModal(card, counter)
						}
					})
				})
		})
	})

	function addCounter(card) {
		const counterElem = card.querySelector('.counter');
		const input = counterElem.querySelector('.counter__input');
		const increaseBtn = counterElem.querySelector('.counter__increase');
		const decreaseBtn = counterElem.querySelector('.counter__decrease');

		const counter = new Counter(input);
		increaseBtn.addEventListener('click', () => {
			counter.increase();
		})
		decreaseBtn.addEventListener('click', () => {
			counter.decrease()
		})

		return counter;
	}

	function showModal(card, counter) {
		const modal = document.createElement('div');
		modal.className = 'modal';
		const modalContent = document.createElement('div');
		modalContent.className = 'modal__content';
		const closeBtn = document.createElement('button');
		closeBtn.className = 'modal__closeBtn';
		closeBtn.innerText = 'X';
		closeBtn.addEventListener('click', () => {
			modal.remove();
		});
		document.onclick = (e) => {
			if (e.target !== modalContent && !modalContent.contains(e.target)) {
				modal.remove();
			}
		}

		const cloneCard = card.cloneNode(true);
		cloneCard.id = '';
		const newCounter = addCounter(cloneCard);
		const cloneCardBtn = cloneCard.querySelector('.product-card__add-to-cart');
		cloneCardBtn.addEventListener('click', () => {
			counter.value = newCounter.value;
			modal.remove();
		})
		cloneCardBtn.innerText = 'Добавить в корзину';
		const desc = cloneCard.querySelector('.product-card__description');
		desc.hidden = false;
		
		modalContent.append(closeBtn, cloneCard);
		modal.append(modalContent);
		
		document.body.append(modal);
	}	
}