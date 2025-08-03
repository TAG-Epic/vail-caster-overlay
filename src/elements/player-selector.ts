import { html, type HTMLTemplateResult, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Task } from "@lit/task";
import "./player-profile.ts";

@customElement("ass-player-selector")
export class PlayerSelectorElement extends LitElement {
	@property({type: Array})
	public playerIds: string[];
	@property({type: String})
	public searchQuery: string;

	static styles = css`
		.player-profile {
			display: flex;
			gap: 1em;
		}
		.player-profile > img {
			height: 4em;
			width: 4em;
		}
	`;

	constructor() {
		super();
		this.playerIds = [];
		this.searchQuery = "";
	}

	
	private searchTask = new Task(this, {
		task: async ([searchQuery], {signal}) => {
			const queryParams = new URLSearchParams({
				name: searchQuery
			});
			const response = await fetch(`https://vail-api.farfrom.world/api/v3/users/search?${queryParams}`, {
				signal,
				method: "POST"
			});
			if (!response.ok) {
				throw new Error(response.status);
			}
			return (await response.json()).items;
		},
		args: () => [this.searchQuery]
	  });
	


	render(): HTMLTemplateResult {
		return html`
			<div class="players">
				${
					this.playerIds.map(playerId => html`
						<div class="player-actions">
							<ass-player-profile .id=${playerId}></ass-player-profile>		
							<button type="button" @click=${() => {
								this.playerIds = this.playerIds.filter(id => id !== playerId);
								this.dispatchEvent(new CustomEvent("set", {detail: {playerIds: this.playerIds}}));
							}}>X</button>
						</div>
					`)
				}
			</div>
			<div class="add-player">
				<input type="text" placeholder="Pan" @input=${(event) => {this.searchQuery = event.target.value;}}>
				${this.searchTask.render({
					pending: () => html`Searching`,
					error: () => html`Failed to load`,
					complete: (results) => results.map(result => html`
						<div class="player-profile">
							<img src=${result.avatar_url}>
							<p>${result.display_name}</p>
							<button @click=${() => {
								this.playerIds = [...this.playerIds, result.id];
								this.dispatchEvent(new CustomEvent("set", {detail: {playerIds: this.playerIds}}));
							}}>Add</button>
						</div>
				    `)
				})}
			</div>
		`;
	}
}
