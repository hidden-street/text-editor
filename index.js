const JD_TextEditor_BUTTONS = {
	bold: {
		content: '𝐁',
		icon: 'format_bold',
		className: 'bold',
		title: 'Toggle bold',
		command: 'bold'
	},
	italic: {
		content: 'ⅈ',
		icon: 'format_italic',
		className: 'italic',
		title: 'Toggle italic',
		command: 'italic'
	},
	sup: {
		content: '²',
		className: 'superscript',
		title: 'Toggle superscript',
		command: 'superscript'
	},
	sub: {
		content: '₂',
		className: 'subscript',
		title: 'Toggle subscript',
		command: 'subscript'
	},
	image: {
		content: '📷',
		icon: 'image',
		className: 'img',
		title: 'Insert an image',
		customCommand: () => {
			var imageSrc;

			do {
				imageSrc = window.prompt('Image URL', 'https://');
			} while (imageSrc === '');

			if (typeof imageSrc !== 'string') {
				return;
			}

			document.execCommand('insertImage', false, imageSrc);
		}
	},
	clear: {
		content: '🗑',
		icon: 'format_clear',
		className: 'removeFormat',
		title: 'Remove all formatting',
		command: 'removeFormat'
	}
};

class JD_TextEditor {
	constructor(textarea, options) {
		if (typeof options === 'undefined') {
			options = {};
		}
		
		if (typeof options.baseURL === 'string') {
			this.baseURL = options.baseURL;
		}

		if (Array.isArray(options.buttons)) {
			this.buttons = options.buttons;
		}
		else {
			this.buttons = JD_TextEditor_BUTTONS;
		}

		if (typeof options.buttonsAreaClassName === 'string') {
			this.buttonsAreaClassName = options.buttonsAreaClassName;
		}
		else {
			this.buttonsAreaClassName = 'jd-text-editor-options';
		}

		if (typeof options.buttonsClassName === 'string') {
			this.buttonsClassName = options.buttonsClassName;
		}
		else if (Array.isArray(options.buttonsClassName)) {
			this.buttonsClassName = options.buttonsClassName.join(' ');
		}
		else {
			this.buttonsClassName = 'button';
		}

		this.textarea = textarea;

		if (this.buttons) {
			this.buttonsArea = document.createElement('div');
			this.buttonsArea.className = this.buttonsAreaClassName;
			this.textarea.parentNode.insertBefore(this.buttonsArea, this.textarea);

			Object.values(this.buttons).forEach((button) => {
				var btn = document.createElement('button');

				if (this.buttonsClassName) {
					btn.className = this.buttonsClassName;
				}

				if (button.className) {
					btn.classList.add.apply(btn.classList, button.className.split(' '));
				}
				if (button.title) {
					btn.title = button.title;
				}
				if (button.icon) {
					btn.dataset.icon = button.icon;
				}
				if (button.content) {
					btn.innerHTML = button.content;
				}

				btn.addEventListener('click', (e) => {
					e.preventDefault();

					if (button.command) {
						document.execCommand(button.command, false, null);
					}
					if (button.customCommand) {
						button.customCommand.call(this, button);
					}

					if (this.baseURL) {
						this.editorArea.innerHTML = this.setURLs();
						this.textarea.value = this.reverseURLs();
					}
					else {
						this.textarea.value = this.editorArea.innerHTML;
					}
				}, false);

				this.buttonsArea.appendChild(btn);
				this.buttonsArea.appendChild(document.createTextNode(' '));
			});
		}

		this.editorArea = document.createElement('pre');
		this.editorArea.className = this.textarea.className;
		this.editorArea.contentEditable = true;
		this.editorArea.style.minHeight = this.textarea.offsetHeight + 'px';
		this.editorArea.innerHTML = this.textarea.value;
		this.textarea.parentNode.insertBefore(this.editorArea, this.textarea);

		try {
			document.execCommand('styleWithCSS', false, false);
		}
		catch (e) {
			// do nothing
		}


		if (this.baseURL) {
			this.setURLs = function () {
				return this.editorArea.innerHTML.replace(new RegExp('(src|href)="([^http|https|ftp|//][^"]+)"', 'gi'), '$1="' + this.baseURL + '$2"');
			};

			this.reverseURLs = function () {
				return this.editorArea.innerHTML.replace(new RegExp('(src|href)="' + this.baseURL + '([^"]+)"', 'gi'), '$1="$2"');
			};

			this.editorArea.addEventListener('input', () => {
				this.textarea.value = this.reverseURLs();
			}, false);

			this.editorArea.innerHTML = this.setURLs();
		}

		this.textarea.setAttribute('hidden', true);
	}
}

document.querySelectorAll('textarea.jd-text-editor').forEach((area) => {
	new JD_TextEditor(area);
});
