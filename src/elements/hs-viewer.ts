import { html, type HTMLTemplateResult, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Task } from "@lit/task";

@customElement("ass-hs-viewer")
export class PlayerProfileElement extends LitElement {
	@property({type: String})
	public id: string;

	static styles = css`
		.player-profile {
			display: flex;
			gap: 1em;
		}
		.player-profile > img {
			height: 4em;
			width: 4em;
		}
		.part-text {
			fill: white;
			text-align: center;
			width: 4ch;
			white-space: pre;
		}
		.left-arm-text {
			display: block;
		}
		svg {
			height: calc(var(--size) * 2);
			width: calc(var(--size) * 2);
		}
	`;

	constructor() {
		super();
		this.id = "";
	}

	
	private fetchTask = new Task(this, {
		task: async ([userId], {signal}) => {
			const response = await fetch(`https://vail-api.farfrom.world/api/v3/users/${encodeURIComponent(userId)}/stats/raw`, {
				signal,
			});
			if (!response.ok) {
				throw new Error(response.status);
			}
			return await response.json();
		},
		args: () => [this.id]
	  });
	


	render(): HTMLTemplateResult {
		return this.fetchTask.render({
			pending: () => html`fetching`,
			error: () => html`>:(`,
			complete: data => this.renderVisualizer(data)
		})
	}
	renderVisualizer(stats) {
		const rates = this.getHitRates(stats);
		return html`
			<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
				<circle class="head" cx="100" cy="50" r="30" fill=${this.getColorForRate(rates.head)} />
				<text class="head-text part-text" x="75" y="55" width="4ch">${Math.floor(rates.head * 100).toString().padStart(3, " ")}%</text>
				<rect class="body" width="80" height="100" fill=${this.getColorForRate(rates.body)} x="60" y="90" />
				<text class="body-text part-text" x="75" y="145">${Math.floor(rates.body * 100).toString().padStart(3, " ")}%</text>
				<rect class="arm left-arm" width="30" height="100" fill=${this.getColorForRate(rates.arm)} x="15" y="90" />
				<text class="left-arm-text arm-text part-text" x="25" y="140" text-anchor="middle" dominant-baseline="central" transform="rotate(90 30 140)">${Math.floor(rates.arm * 100).toString().padStart(3, " ")}%</text>
				<rect class="arm right-arm" width="30" height="100" fill=${this.getColorForRate(rates.arm)} x="155" y="90" />
				<text class="right-arm-text arm-text part-text" x="25" y="0" text-anchor="middle" dominant-baseline="central" transform="rotate(90 30 140)">${Math.floor(rates.arm * 100).toString().padStart(3, " ")}%</text>
				<rect class="leg left-leg" width="30" height="100" fill=${this.getColorForRate(rates.leg)} x="60" y="200" />
				<text class="left-leg-text leg-text part-text" x="140" y="95" text-anchor="middle" dominant-baseline="central" transform="rotate(90 30 140)">${Math.floor(rates.leg * 100).toString().padStart(3, " ")}%</text>
				<rect class="leg right-leg" width="30" height="100" fill=${this.getColorForRate(rates.leg)} x="110" y="200" />
				<text class="right-leg-text leg-text part-text" x="140" y="45" text-anchor="middle" dominant-baseline="central" transform="rotate(90 30 140)">${Math.floor(rates.leg * 100).toString().padStart(3, " ")}%</text>
			</svg>
		`;
		
	}
	getHitRates(stats) {
		const codeToValue = new Map();
		for (const item of stats) {
			codeToValue.set(item.statCode, item.value);
		}
		const hitHead = codeToValue.get("shots-hit-head");
		const hitBody = codeToValue.get("shots-hit-body");
		const hitArm = codeToValue.get("shots-hit-arm");
		const hitLeg = codeToValue.get("shots-hit-leg");
		const totalHits = hitHead + hitBody + hitLeg + hitArm;

		return {
            head: hitHead / totalHits,
            body: hitBody / totalHits,
            arm: hitArm / totalHits,
            leg: hitLeg / totalHits,
		};

	}
	getColorForRate(rate) {
        const redHitColor = 0xFF * rate;
        const redHitColorHex = Math.floor(redHitColor).toString(16).padStart(2, "0");

        return `#${redHitColorHex}0000`
	}
}
