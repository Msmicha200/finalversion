document.addEventListener('DOMContentLoaded', () => {
	const tabs = uvm.qa('.tab');
	const border = uvm.q('.border');
	const activeTab = uvm.q('.tab.active');
	const tabsWrapper = uvm.q('.buttons');
	let properties = activeTab.getBoundingClientRect();
	let _properties = tabsWrapper.getBoundingClientRect();
	
	setTimeout(() => {
		properties = activeTab.getBoundingClientRect();
		_properties = tabsWrapper.getBoundingClientRect();
		border.style.width = properties.width + 'px';
		border.style.left = (properties.left - _properties.left) + 'px';
	}, 100);
	
	const tabSwitch = function () {
		if (!this.classList.contains('active')) {

			_properties = tabsWrapper.getBoundingClientRect();

			const _active = uvm.q('.tab.active');
			const active = uvm.byId(`${_active.id}-content`);
			const next = uvm.byId(`${this.id}-content`);
			const isRight = this.getBoundingClientRect().left 
				< _active.getBoundingClientRect().left;
			active.classList.remove('ative-content');
			_active.classList.remove('active');
			this.classList.add('active');
			next.classList.add('active-content');

			const props = this.getBoundingClientRect();

			border.style.left = (props.left - _properties.left) + 'px';
			border.style.width = props.width + 'px';

			const right = isRight ? "100vw" : "-100vw";
            const left = isRight ? "-100vw" : "100vw";

            active.style.transform = `translateX(${right})`;
            next.style.display = 'flex';
            next.style.transition = '0s';
            next.style.opacity = '0';
            next.style.transform = `translateX(${left})`;

            setTimeout(() => {
            	next.style.opacity = '1';
            	next.style.transition = '.5s';
            	next.style.transform = 'translateX(0)'
            }, 100);

            setTimeout(() => active.style.display = 'none', 400);
		}
	};

	for (const tab of tabs) {
		tab.addEventListener('click', tabSwitch);
	}

});
