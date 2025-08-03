import { html, type HTMLTemplateResult, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Task } from "@lit/task";
import "./player-selector.ts";

@customElement("ass-config")
export class ConfigElement extends LitElement {
	@property({type: Object})
	public config;

	static styles = css`
		.player-profile {
			display: flex;
			gap: 1rem;
		}
		.player-profile > img {
			height: 4rem;
			width: 4rem;
		}
	`;

	constructor() {
		super();
		this.config = this.loadConfig();
	}
	private loadConfig() {
		const rawConfig = localStorage.getItem("config");
		if (rawConfig === null) {
			return {
				playerIds: []
			};
		}
		return JSON.parse(rawConfig);
	}
	private saveConfig() {
		localStorage.setItem("config", JSON.stringify(this.config));
	}

	

	render(): HTMLTemplateResult {
		return html`
			<h1>VAIL Caster Overlay</h1>
			<p>This software is licensed. Please contact @429ratelimited on discord for a license</p>
			<form>
				<ass-player-selector .playerIds=${this.config.playerIds} @set=${(event) => {
					this.config = {
						...this.config,
						playerIds: event.detail.playerIds
					};
					this.saveConfig();
				}}>
			</form>
		`;
	}
}
