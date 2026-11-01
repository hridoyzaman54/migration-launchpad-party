<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

- All prototype content comes from `src/data/mock.ts`; replace these exports with database queries when the backend is added, so pages need minimal changes.
- Theme is a `.dark` class on `<html>` set by an inline pre-paint script plus `ThemeProvider` in `src/lib/theme.tsx`; avoids a flash of the wrong theme.
- Public pages get the shared header/footer from `__root.tsx`; `/admin` routes render without them (own sidebar layout).
