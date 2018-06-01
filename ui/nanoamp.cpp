#include "nanoamp.h"
#include "ui_nanoamp.h"

nanoAmp::nanoAmp(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::nanoAmp)
{
    ui->setupUi(this);
}

nanoAmp::~nanoAmp()
{
    delete ui;
}
