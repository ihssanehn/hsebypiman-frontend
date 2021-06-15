import {LayoutConfigModel} from '../_base/layout';

export class LayoutConfig {
	public defaults: LayoutConfigModel = {
		demo: 'HSE By Piman',
		// == Base Layout
		self: {
			layout: 'fluid', // fluid|boxed
			body: {
				'background-image': './assets/media/hse-png/bkg-header.png',
				'background-position': 'center top',
				'background-size': '100% 375px',
			},
			logo: './assets/media/hse-png/logo-by-piman-circle.png',
		},
		// == Page Splash Screen loading
		loader: {
			enabled: true,
			type: 'spinner-logo',
			logo: './assets/media/hse-svg/logo-load.svg',
			message: 'Please wait...',
		},
		// == Colors for javascript
		colors: {
			state: {
				brand: '#366cf3',
				light: '#ffffff',
				dark: '#282a3c',
				primary: '#5867dd',
				success: '#34bfa3',
				info: '#36a3f7',
				warning: '#ffb822',
				danger: '#fd3995',
			},
			base: {
				label: [
					'#c5cbe3',
					'#a1a8c3',
					'#3d4465',
					'#3e4466',
				],
				shape: [
					'#f0f3ff',
					'#d9dffa',
					'#afb4d4',
					'#646c9a',
				],
			},
		},
		header: {
			self: {
				width: 'fixed',
				fixed: {
					desktop: {
						enabled: false,
						mode: 'menu',
					},
					mobile: true,
				},
			},
			menu: {
				self: {
					display: true,
					'root-arrow': false,
				},
				desktop: {
					arrow: true,
					toggle: 'click',
					submenu: {
						skin: 'light',
						arrow: true,
					},
				},
				mobile: {
					submenu: {
						skin: 'dark',
						accordion: true,
					},
				},
			},
		},
		subheader: {
			display: true,
			layout: 'subheader-v4',
			width: 'fixed',
			style: 'transparent',
		},
		aside: {
			self: {
				display: true
			},
			menu: {
				'root-arrow': true,
				dropdown: true,
				scroll: true,
				submenu: {
					accordion: true,
					dropdown: {
						arrow: true,
						'hover-timeout': 20
					}
				}
			}
		},
		content: {
			width: 'fixed',
		},
		footer: {
			self: {
				width: 'fixed',
				layout: 'extended',
			},
		},
	};

	/**
	 * Good place for getting the remote config
	 */
	public get configs(): LayoutConfigModel {
		return this.defaults;
	}
}
