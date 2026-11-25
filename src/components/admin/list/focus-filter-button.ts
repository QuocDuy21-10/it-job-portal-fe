/** For controls that disappear when used: sends focus to their list's filter button. */
export function focusFilterButton(control: Element) {
  control
    .closest("[data-admin-list]")
    ?.querySelector<HTMLElement>("[data-filter-button]")
    ?.focus();
}
