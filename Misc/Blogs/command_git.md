# Common Git Commands Summary

## Initialization
- `git init`  
    Initialize a new Git repository.

## Configuration
- `git config --global user.name "Your Name"`  
    Set your global username.
- `git config --global user.email "your.email@example.com"`  
    Set your global email.

## Basic Workflow
- `git status`  
    Show the working tree status.
- `git add <file>`  
    Stage changes for commit.
- `git commit -m "Commit message"`  
    Commit staged changes.

## Branching
- `git branch`  
    List branches.
- `git branch <branch-name>`  
    Create a new branch.
- `git checkout <branch-name>`  
    Switch to a branch.
- `git merge <branch-name>`  
    Merge a branch into the current branch.

## Remote Repositories
- `git remote add origin <url>`  
    Add a remote repository.
- `git push origin <branch>`  
    Push changes to remote.
- `git pull origin <branch>`  
    Fetch and merge changes from remote.
- `git push --set-upstream origin <branch>`
    Set the upstream for a branch and push.
- `git push --force origin <branch>`  
    Force push changes to remote.

## Viewing History
- `git log`  
    Show commit history.
- `git diff`  
    Show changes between commits, branches, etc.

## Undoing Changes
- `git reset --hard <commit>`  
    Reset to a specific commit.
- `git checkout -- <file>`  
    Discard changes in a file.

## Submodule
- `git submodule add <url-of-submodule> <path>`     
    Create new submodule in the specified path.

---

*This summary covers essential Git commands for daily use.*