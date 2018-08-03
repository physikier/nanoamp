#ifndef NANOAMP_H
#define NANOAMP_H

#include <QMainWindow>

namespace Ui {
class nanoAmp;
}

class nanoAmp : public QMainWindow
{
    Q_OBJECT

public:
    explicit nanoAmp(QWidget *parent = 0);
    ~nanoAmp();

private:
    Ui::nanoAmp *ui;
};

#endif // NANOAMP_H
