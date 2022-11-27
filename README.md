# Docker Image Update Monitor
Monitor docker images update on image registry using GitHub Actions

## Usage
A demo is shown below. You shouldn't change the steps marked as `[Necessary]`. What you need to do is:
- [Must] Set the image name and tag (default to latest) in `env` part, currently only support public images in DockerHub.
- [optional] Set the time interval checking the update in `on`-`schedule`-`cron` part.
- [optional] Set the notification-related info, like email notifier in the last step.

```yaml
name: "test"
on:
  schedule:
    # Every hour
    - cron: '0 */1 * * *'

env:
  IMAGE: sharelatex/sharelatex
  TAG: latest

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # [Necessary] Create ENV Event to escape \ in image name
    - name: Create ENV EVENT
      run: |
        echo EVENT=`echo ${{ env.IMAGE }} | sed 's#/#\##g'`_${{ env.TAG }} >> $GITHUB_ENV

      # [Necessary] Restore the cache saved in the last run
    - name: Cache file
      uses: actions/cache@v3
      with:
        key: ${{ env.EVENT }}-${{ github.run_number }}
        restore-keys: |
          ${{ env.EVENT }}-
        path: ${{ env.EVENT }}.json

      # [Necessary] Check update
    - name: Check DockerHub image with latest tag
      id: dockerhub
      uses: ActionsTools/docker-image-update-monitor-action@v1.0.0
      with:
        image: ${{ env.IMAGE }}
        tag: ${{ env.TAG }}

    - name: Show results
      run: |
        echo ${{ steps.dockerhub.outputs.has_update }}
        echo ${{ steps.dockerhub.outputs.update_time }}

    - name: Send email if it has update
      if: ${{ steps.dockerhub.outputs.has_update }} == true
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 465
        username: ${{secrets.MAIL_USERNAME}}
        password: ${{secrets.MAIL_PASSWORD}}
        secure: true
        subject: The image ${{env.IMAGE}} in breach ${{ env.TAG }} has update
        to: ${{ secrets.MAIL_RECEIVER}}
        from: Docker Image Update Monitor
```