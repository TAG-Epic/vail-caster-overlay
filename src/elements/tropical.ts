import { html, type HTMLTemplateResult, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Task } from "@lit/task";
import "./player-selector.ts";
import "./hs-viewer.ts";

@customElement("ass-tropical")
export class TropicalElement extends LitElement {
	static styles = css`
		.players {
			display: flex;
			justify-content: space-between;
		}
		.left,.right {
			display: grid;
			grid-template-columns: repeat(2, max-content);
		}
		.player {
			display: grid;
			grid-column: span 2;
			grid-template-columns: subgrid;
			align-items: center;
		}
		ass-hs-viewer {
			--size: 6em;
		}
	`;

	constructor() {
		super();
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

	render(): HTMLTemplateResult {
		const config  = this.loadConfig();
		return html`
			<div class="players">
				<div class="left">
					${config.playerIds.slice(0, 5).map(playerId => html`
						<div class="player">
							<ass-player-profile id=${playerId}></ass-player-profile>
							<ass-hs-viewer id=${playerId}></ass-hs-viewer>
						</div>
				   `)}
				</div>
				<div class="right">
					${config.playerIds.slice(5).map(playerId => html`
						<div class="player">
							<ass-hs-viewer id=${playerId}></ass-hs-viewer>
							<div class="profile">
								<ass-player-profile id=${playerId}></ass-player-profile>
							</div>
						</div>
				   `)}
				</div>
			</div>
		`;
	}
}
