import { html, type HTMLTemplateResult, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Task } from "@lit/task";

@customElement("ass-player-profile")
export class PlayerProfileElement extends LitElement {
	@property({type: String})
	public id: string;

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
		this.id = "";
	}

	
	private fetchTask = new Task(this, {
		task: async ([userId], {signal}) => {
			const response = await fetch(`https://vail-api.farfrom.world/api/v3/users/${encodeURIComponent(userId)}/info`, {
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
			complete: data => html`
				<div class="player-profile">
					<img src=${data.avatar_url}>
					<p>${data.display_name}</p>
				</div>
			`
		})
	}
}
